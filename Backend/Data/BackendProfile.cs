﻿using AutoMapper;
using Backend.Data.Dtos.Playlists;
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

            CreateMap<Playlist, PlaylistDto>();
            CreateMap<CreatePlaylistDto, Playlist>();
            CreateMap<UpdatePlaylistDto, Playlist>();
        }
    }
}
