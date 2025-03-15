import { SubtopicRepository } from "./subtopic.repository";
import { Subtopic } from "./subtopic.entity";
import { Topic } from "../topic/topic.entity";
import axios from "axios";

export class SubtopicService {
  private static instance: SubtopicService;
  private subtopicRepo: SubtopicRepository;

  private constructor(subtopicRepo: SubtopicRepository) {
    this.subtopicRepo = subtopicRepo;
  }

  static getInstance(): SubtopicService {
    if (!SubtopicService.instance) {
      SubtopicService.instance = new SubtopicService(SubtopicRepository.getInstance());
    }
    return SubtopicService.instance;
  }

  async generateSubtopicsForTopics(topics: Topic[]): Promise<void> {
    try {
      // 1️⃣ Извличаме подтеми от /subtopics/extract
      const topicNames = topics.map(topic => topic.name);
      const subtopicRes = await axios.post("https://agent.exodiafmi.com/subtopics/extract", {
        topics: topicNames,
      });

      if (!subtopicRes.data || !subtopicRes.data.data) {
        throw new Error("Invalid response from subtopic extraction service");
      }

      // Съхраняваме Subtopic обектите временно в памет
      const subtopicsInMemory: Subtopic[] = [];

      // 2️⃣ Обхождаме резултата и свързваме подтемите с темите
      subtopicRes.data.data.forEach((topicData: any) => {
        const matchingTopic = topics.find(t => t.name === topicData.topic);
        if (!matchingTopic) return;

        topicData.subtopics.forEach((subtopicName: string) => {
          const tempSubtopic = new Subtopic(subtopicName, "", matchingTopic);
          subtopicsInMemory.push(tempSubtopic);
        });
      });

      if (!subtopicsInMemory.length) return; // Ако няма подтеми, излизаме

      // 3️⃣ Разделяме заявките на малки групи (batch processing)
      const batchSize = 5; // Изпращаме само 5 подтеми наведнъж
      const dataToExplain: { topic: string; subtopics: string[] }[] = [];

      topics.forEach(t => {
        const subNames = subtopicsInMemory
          .filter(st => st.topic === t)
          .map(st => st.name);

        if (subNames.length > 0) {
          dataToExplain.push({ topic: t.name, subtopics: subNames });
        }
      });

      // 4️⃣ Извикваме API-то за обяснения с изчакване между заявките
      for (let i = 0; i < dataToExplain.length; i += batchSize) {
        const batch = dataToExplain.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1}/${Math.ceil(dataToExplain.length / batchSize)}`);

        try {
          const explResponse = await axios.post("https://agent.exodiafmi.com/explanations/generate", {
            data: batch
          });

          if (!explResponse.data || !explResponse.data.explanations) {
            throw new Error("Invalid response from explanations service");
          }

          // Свързваме обясненията с подтемите
          explResponse.data.explanations.forEach((item: any) => {
            const subtopic = subtopicsInMemory.find(st => st.topic.name === item.topic && st.name === item.subtopic);
            if (subtopic) {
              subtopic.text = item.explanation.replace(/\x00/g, ""); // Премахва null байтове
            }
          });
        } catch (error) {
          console.error("Error in batch processing:", error);
        }

        // Изчакване, за да не спамим API-то (throttling)
        await new Promise(res => setTimeout(res, 1000)); // 1 секунда пауза
      }

      // 5️⃣ Извикваме API-то за векторизация, за да попълним embedding
      const vectorizePayload = subtopicsInMemory.map((st, index) => ({
        id: index.toString(),
        text: st.text || "",
      }));

      try {
        const vectResponse = await axios.post("https://agent.exodiafmi.com/vectorize/array", vectorizePayload);

        if (!vectResponse.data || !vectResponse.data.results) {
          throw new Error("Invalid response from vectorize service");
        }

        // Свързваме embedding към подтемите
        const embeddingsByIndex: Record<string, number[]> = {};
        vectResponse.data.results.forEach((res: any) => {
          embeddingsByIndex[res.id] = res.embedding;
        });

        subtopicsInMemory.forEach((st, index) => {
          const embedding = embeddingsByIndex[index.toString()];
          if (embedding) {
            st.embedding = JSON.stringify(embedding);
          }
        });
      } catch (error) {
        console.error("Error in embedding generation:", error);
      }

      // 6️⃣ Записваме подтемите в базата на партиди (bulk insert)
      const saveBatchSize = 5; // Намаляваме броя на записите в една партида

      for (let i = 0; i < subtopicsInMemory.length; i += saveBatchSize) {
        const batch = subtopicsInMemory.slice(i, i + saveBatchSize);
        await this.subtopicRepo.createSubtopics(batch); // Ползваме bulk insert

        // Изчакване между партидите, за да не натоварваме сървъра
        await new Promise(res => setTimeout(res, 1000));
      }

      console.log("✅ Successfully processed all subtopics!");

    } catch (error) {
      console.error("Error generating subtopics with text and embedding:", error);
      throw new Error("Failed to generate subtopics with text and embedding");
    }
  }




}
