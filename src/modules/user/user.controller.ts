import { inject, injectable } from 'inversify';
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
import { createJWT, fillDTO } from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import { JWT_ALGORITHM } from './user.constants.js';
import LoggedUserResponse from './response/logged-user.response.js';
import UploadUserAvatarResponse from './response/upload-user-avatar.response.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface,
  ) {
    super(logger, configService);
    this.logger.info('Registering the roots for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new UploadFileMiddleware(this.configService
          .get('UPLOAD_DIRECTORY'), 'avatar')
      ]
    });
  }

  public async create(
    {body, user: loggedUser}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    if (loggedUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'To register a new user you have to logout first',
        'UserController'
      );
    }

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
    res: Response
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {email: user.email, id: user.id}
    );

    this.ok(res,
      {...fillDTO(LoggedUserResponse, user), token});
  }


  public async checkAuthenticate(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    const user = await this.userService.findByEmail(req.user.email);
    this.ok(res, fillDTO(LoggedUserResponse, user));
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploadFile = {avatarUrl: req.file?.filename};
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarResponse, uploadFile));
  }

}
