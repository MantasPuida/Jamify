using AutoMapper;
using Backend.Data.Dtos.Playlists;
using Backend.Data.Entities;
using Backend.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/users/{userId}/playlists")]
    public class PlaylistsController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IPlaylistsRepository _playlistsRepository;
        private readonly IMapper _mapper;

        public PlaylistsController(IUsersRepository usersRepository, IMapper mapper, IPlaylistsRepository playlistsRepository)
        {
            _usersRepository = usersRepository;
            _mapper = mapper;
            _playlistsRepository = playlistsRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<PlaylistDto>> GetPlaylistsAsync(Guid userId)
        {
            var user = await _playlistsRepository.GetPlaylistsAsync(userId);
            return user.Select(o => _mapper.Map<PlaylistDto>(o));
        }

        [HttpGet(template: "{playlistId}")]
        public async Task<ActionResult<PlaylistDto>> GetPlaylistAsync(Guid userId, Guid playlistId)
        {
            var playlist = await _playlistsRepository.GetPlaylistAsync(userId, playlistId);
            if (playlist == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<PlaylistDto>(playlist));
        }

        [HttpPost]
        public async Task<ActionResult<PlaylistDto>> PostAsync(Guid userId, CreatePlaylistDto playlistDto)
        {
            var user = await _usersRepository.GetUserAsync(userId);
            if (user == null)
            {
                return NotFound($"Couldn't find a user with id of {userId}");
            }

            var playlist = _mapper.Map<Playlist>(playlistDto);
            playlist.UserId = userId;

            await _playlistsRepository.InsertPlaylistAsync(playlist);

            return Created($"/api/users/{userId}/playlists/{playlist.PlaylistId}", _mapper.Map<PlaylistDto>(playlist));
        }

        [HttpPut(template: "{playlistId}")]
        public async Task<ActionResult<PlaylistDto>> PostAsync(Guid userId, Guid playlistId, UpdatePlaylistDto playlistDto)
        {
            var user = await _usersRepository.GetUserAsync(userId);
            if (user == null)
            {
                return NotFound($"Couldn't find a playlist with id of {userId}");
            }

            var oldPlaylist = await _playlistsRepository.GetPlaylistAsync(userId, playlistId);
            if (oldPlaylist == null)
            {
                return NotFound();
            }

            _mapper.Map(playlistDto, oldPlaylist);

            await _playlistsRepository.UpdatePlaylistAsync(oldPlaylist);

            return Ok(_mapper.Map<PlaylistDto>(oldPlaylist));
        }

        [HttpDelete("{playlistId}")]
        public async Task<ActionResult> DeleteAsync(Guid userId, Guid playlistId)
        {
            var playlist = await _playlistsRepository.GetPlaylistAsync(userId, playlistId);
            if (playlist == null)
            {
                return NotFound();
            }

            await _playlistsRepository.DeletePlaylistAsync(playlist);

            return NoContent();
        }
    }
}
