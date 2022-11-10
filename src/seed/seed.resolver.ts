import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, {
    name: 'executeSeed',
    description: 'Crea o restablece datos de prueba de la app',
  })
  async executeSeed(): Promise<boolean> {
    return this.seedService.executeSeed();
  }
}
