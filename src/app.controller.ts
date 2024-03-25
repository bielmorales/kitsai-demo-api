import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService, GetJobsOutput } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTTS(@Query('page') page: string): Promise<GetJobsOutput> {
    const pageNumber = parseInt(page, 10) || 1;
    return this.appService.getTTS(pageNumber);
  }

  @Post('generate')
  async createTTS(
    @Body() body: { inputTtsText: string; voiceModelId: string },
  ): Promise<{ msg: string }> {
    return this.appService.createTTS(body.inputTtsText, body.voiceModelId);
  }
}
