import { inject, injectable } from 'tsyringe';

import { SessionResponseInterface } from '../interfaces/SessionInterface';
import * as sessionView from '../utils/views/sessions_view';
import IUserRepository from '../interfaces/repositories.ts/IUserRepository';
import { HttpError } from '../utils/errors/HttpError';

@injectable()
class SessionService {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) {}

    public async create(
        email: string,
        password: string,
    ): Promise<SessionResponseInterface> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new HttpError(404, 'User not found');

        if (!(await user.checkPassword(password))) {
            throw new HttpError(401, 'Password does no match');
        }

        return sessionView.render(user);
    }
}

export default SessionService;