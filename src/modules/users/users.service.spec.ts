import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UUID } from 'crypto';
import { CreateUserDTO } from './dto/User.dto';
import { UpdateUserDTO } from './dto/Update.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { eCountry } from 'src/utils/countrys/country.model';
import { UserDBService } from 'src/modules/users/userDB.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  let userDBService: UserDBService;

  const mockUser: Partial<CreateUserDTO> = {
    nombre: 'John Doe',
    dni: '12345678',
    country: eCountry.argentina,
    city: 'Buenos Aires',
    address: 'Calle Falsa 123',
    email: 'john.doe@example.com',
    password: 'Password123*',
    confirmPassword: 'Password123*',
    phone: '+54 11 1234-5678',
    isAdmin: true,
  };

  const mockUserEntity: Partial<User> = {
    id: 'some-uuid' as unknown as UUID,
    ...mockUser,
  };

  const mockUserDBService = {
    addUser: jest.fn().mockResolvedValue(mockUserEntity),
    deleteUser: jest.fn().mockResolvedValue(true),
    getUsers: jest.fn().mockResolvedValue([mockUserEntity]),
    getUserById: jest.fn().mockResolvedValue(mockUserEntity),
    updateUserById: jest.fn().mockResolvedValue(mockUserEntity),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            addUser: jest.fn().mockResolvedValue(mockUserEntity),
            deleteUser: jest.fn().mockResolvedValue(true),
            getUsers: jest.fn().mockResolvedValue([mockUserEntity]),
            getUserById: jest.fn().mockResolvedValue(mockUserEntity),
            updateUserById: jest.fn().mockResolvedValue(mockUserEntity),
          },
        },
        {
          provide: UserDBService,
          useValue: mockUserDBService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    userDBService = module.get<UserDBService>(UserDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addUser', () => {
    it('should add a user', async () => {
      const result = await service.addUser(mockUser as CreateUserDTO);
      expect(result).toEqual(mockUserEntity);
      expect(repository.addUser).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException if addUser fails', async () => {
      jest.spyOn(repository, 'addUser').mockRejectedValueOnce({ detail: 'Error detail' });
      await expect(service.addUser(mockUser as CreateUserDTO)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const id = 'some-uuid' as unknown as UUID;
      await service.deleteUser(id);
      expect(repository.deleteUser).toHaveBeenCalledWith(id);
    });
  });

  describe('getUsers', () => {
    it('should get users with pagination', async () => {
      const result = await service.getUsers(1, 10);
      expect(result).toEqual([mockUserEntity]);
      expect(repository.getUsers).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const id = 'some-uuid' as unknown as UUID;
      const result = await service.getUserById(id);
      expect(result).toEqual(mockUserEntity);
      expect(repository.getUserById).toHaveBeenCalledWith(id);
    });
  });

  describe('updateUserById', () => {
    it('should update a user', async () => {
      const updateUserDTO: UpdateUserDTO = { id: 'some-uuid' as unknown as UUID, ...mockUser };
      const result = await service.updateUserById(updateUserDTO);
      expect(result).toEqual(mockUserEntity);
      expect(repository.updateUserById).toHaveBeenCalledWith(updateUserDTO);
    });
  });
});
