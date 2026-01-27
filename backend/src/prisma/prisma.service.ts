import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit
} from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    const {
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_HOST,
      POSTGRES_PORT,
      POSTGRES_DB
    } = process.env

    const DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public`

    const adapter = new PrismaPg({
      connectionString: DATABASE_URL
    })
    super({ adapter })
  }

  public async onModuleInit() {
    this.logger.log('🔄 Initializing database connection...')

    try {
      await this.$connect()
      this.logger.log('✅ Database connection established successfully.')
    } catch (error) {
      this.logger.error('❌ Failed to establish database connection.', error)
      throw error
    }
  }

  public async onModuleDestroy() {
    this.logger.log('🔻 Closing database connection...')

    try {
      await this.$disconnect()
      this.logger.log('🟢 Database connection closed successfully.')
    } catch (error) {
      this.logger.error(
        '⚠️ Error occurred while closing the database connection.',
        error
      )
      throw error
    }
  }
}
