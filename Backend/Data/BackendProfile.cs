using AutoMapper;
using Backend.Data.Dtos.Users;
using Backend.Data.Entities;

namespace Backend.Data
{
    public class BackendProfile : Profile
    {
        public BackendProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<CreateUserDto, User>();
        }
    }
}
