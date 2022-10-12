import { inject } from 'inversify';
import { Request, Response } from 'express';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import LoginUserDto from './dto/login-user.dto.js';

export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface)
    private readonly configService: ConfigInterface,
  ) {
    super(logger);
    this.logger.info('Registering the roots for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.check
    });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existedUser = await this.userService.findByEmail(body.email);

    if (existedUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with the email «${body.email}» already exists`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    _res: Response
  ): Promise<void> {
    const existedUser = await this.userService.findByEmail(body.email);

    if (!existedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with the email ${body.email} not found`,
        'UserController'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }


  public async check(
    _req: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    _res: Response
  ): Promise<void> {

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

}
