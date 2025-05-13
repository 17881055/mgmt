import { Command, CommandRunner } from 'nest-commander';
import { UsersService } from '@/app/users/users.service';
import { ConflictException, Logger } from '@nestjs/common';
import { usersSeedData } from './seed/seed-data';
import { timeout, UserCreateDto } from '@workspace/shared';

/**
 * SeedCommand 类用于向数据库中填充初始数据。
 * 继承自 CommandRunner，可作为命令行命令运行。
 */
@Command({
    name: 'seed', // 命令名称
    description: 'Seed initial data to database', // 命令描述
})
export class SeedCommand extends CommandRunner {
    // 创建一个日志记录器实例，记录与 SeedCommand 相关的日志
    private readonly logger = new Logger(SeedCommand.name);

    /**
     * 构造函数，注入 UsersService 实例。
     * @param usersService - 用户服务实例，用于创建用户。
     */
    constructor(private readonly usersService: UsersService) {
        super();
    }

    /**
     * 执行种子命令的主方法，用于触发测试用户的创建。
     * @returns 一个 Promise，当所有操作完成时 resolve。
     */
    async run(): Promise<void> {
        // 调用 createTestUsers 方法，传入种子数据
        await this.createTestUsers(usersSeedData);
    }

    /**
     * 创建测试用户的方法，遍历用户数据并逐个创建用户。
     * @param users - 用户创建数据传输对象数组，包含要创建的用户信息。
     */
    async createTestUsers(users: UserCreateDto[]) {
        // 遍历用户数组
        for (const _user of users) {
            // 记录正在创建的用户邮箱
            this.logger.verbose(`Creating account: ${_user.email}`);
            // 等待 200 毫秒
            await timeout(200);

            try {
                // 调用用户服务的 createOne 方法创建用户
                const user = await this.usersService.createOne(_user);
                // 记录用户创建成功信息及用户 ID
                this.logger.verbose(`Account has been created! ID: ${user.id}`);
            } catch (e) {
                // 如果捕获到冲突异常
                if (e instanceof ConflictException) {
                    // 记录用户已存在的错误信息
                    this.logger.error('The account already exists');
                } else {
                    // 记录其他错误信息
                    this.logger.error(e);
                }
            }
        }
    }
}
