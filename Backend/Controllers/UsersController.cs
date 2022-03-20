using AutoMapper;
using Backend.Data.Dtos.Users;
using Backend.Data.Entities;
using Backend.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;

        public UsersController(IUsersRepository usersRepository, IMapper mapper)
        {
            _usersRepository = usersRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            return (await _usersRepository.GetUsersAsync()).Select(o => _mapper.Map<UserDto>(o));
        }

        [HttpGet(template: "{userId}")]
        public async Task<ActionResult<UserDto>> GetUser(Guid userId)
        {
            var user = await _usersRepository.GetUserAsync(userId);
            if (user == null)
            {
                return NotFound($"User with id '{userId}' not found.");
            }

            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Post(CreateUserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);

            await _usersRepository.InsertUserAsync(user);

            return Created($"/api/users/{user.UserId}", _mapper.Map<UserDto>(user));
        }

        [HttpPut("{userId}")]
        public async Task<ActionResult<UserDto>> Put(Guid userId, UpdateUserDto userDto)
        {
            var user = await _usersRepository.GetUserAsync(userId);
            if (user == null)
            {
                return NotFound($"User with id '{userId}' not found.");
            }

            _mapper.Map(userDto, user);

            await _usersRepository.UpdateUserAsync(user);

            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpDelete(template: "{userId}")]
        public async Task<ActionResult<UserDto>> Delete(Guid userId)
        {
            var user = await _usersRepository.GetUserAsync(userId);
            if (user == null)
            {
                return NotFound($"User with id '{userId}' not found.");
            }

            await _usersRepository.DeleteUserAsync(user);

            return NoContent();
        }
    }
}
