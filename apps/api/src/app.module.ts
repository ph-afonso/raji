import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common';

@Module({
  imports: [
    // Modulo comum: filters, interceptors, pipes globais
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
