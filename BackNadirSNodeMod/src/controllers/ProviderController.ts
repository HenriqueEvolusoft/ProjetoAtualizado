import { NextFunction, Request, Response } from 'express';
import Controller from './Controller';
import Provider from '../schemas/Provider';
import ValidationService from '../services/ValidationService';

import ServerErrorException from '../errors/ServerErrorException';
import NoContentException from '../errors/NoContentException';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';
import ProviderService from '../services/ProviderService';

class ProviderController extends Controller {
  constructor() {
    super('/provider');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const providers = await Provider.find();

      if (providers.length) return responseOk(res, providers);
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;

      const provider = await Provider.findById(id);
      if (provider) return responseOk(res, provider);
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const provider = await Provider.create(req.body);

      return responseCreate(res, provider);
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;

      const provider = await Provider.findByIdAndUpdate(id, req.body, () => {});
      if (provider) return responseOk(res, provider);

      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;

      const provider = await Provider.findById(id);
      if (provider) {
        provider.deleteOne();
        return responseOk(res, provider);
      }

      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }
}

export default ProviderController;
