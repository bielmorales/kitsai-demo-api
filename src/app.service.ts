import { Injectable } from '@nestjs/common';

export type Job = {
  id: string;
  outputFileUrl?: string;
  status: string;
  createdAt: string;
};

export type GetJobsOutput = {
  data: Job[];
  lastPage: number;
  currentPage: number;
};

@Injectable()
export class AppService {
  async getTTS(page: number): Promise<GetJobsOutput> {
    const response = await fetch(
      `https://arpeggi.io/api/kits/v1/tts?perPage=3&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KITS_AI_TOKEN}`,
        },
      },
    );
    const json = await response.json();
    const data = json.data.map(({ id, outputFileUrl, status, createdAt }) => ({
      id,
      outputFileUrl,
      status,
      createdAt,
    }));
    return { ...json.meta, data: data };
  }

  async createTTS(
    inputTtsText: string,
    voiceModelId: string,
  ): Promise<{ msg: string }> {
    const form = new FormData();
    form.append('inputTtsText', inputTtsText);
    form.append('voiceModelId', voiceModelId);
    const response = await fetch('https://arpeggi.io/api/kits/v1/tts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.KITS_AI_TOKEN}`,
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error(
        `Network response was not ok, status: ${response.status}`,
      );
    }
    return { msg: 'Success' };
  }
}
