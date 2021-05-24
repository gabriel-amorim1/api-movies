import { inject, injectable } from 'tsyringe';
import IUserRepository from '../interfaces/repositories/IUserRepository';
import { SessionResponseInterface } from '../interfaces/SessionInterface';
import { HttpError } from '../utils/errors/HttpError';
import * as sessionView from '../utils/views/sessions_view';

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
        const user = await this.userRepository.findByEmail(email, true);

        if (!user) throw new HttpError(404, 'User not found');

        if (!(await user.checkPassword(password))) {
            throw new HttpError(400, 'Password does no match');
        }

        return sessionView.render(user);
    }
}

export default SessionService;
