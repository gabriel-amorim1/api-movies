import { v4 } from 'uuid';
import {
    UserInterface,
    UserResponseInterface,
} from '../../../interfaces/UserInterface';
import UserRepository from '../../../repositories/UserRepository';
import { render } from '../../../utils/views/users_view';
import UserBuilder from '../../testBuilders/UserBuilder';

export default async (
    userData?: Partial<UserInterface>,
): Promise<UserResponseInterface> => {
    const userRepository = new UserRepository();

    const userBuild = new UserBuilder()
        .withName('Create User')
        .withEmail(`${v4()}@user.com`)
        .withPassword('password')
        .build();

    const createdUser = await userRepository.createAndSave(
        Object.assign(userBuild, userData),
    );

    return render(createdUser);
};
