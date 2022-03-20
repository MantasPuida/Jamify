using AutoMapper;
using Backend.Data.Dtos.Playlists;
using Backend.Data.Dtos.Tracks;
using Backend.Data.Entities;
using Backend.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/users/{userId}/playlists/{playlistId}/tracks")]
    public class TracksController : ControllerBase
    {
        private readonly IPlaylistsRepository _playlistsRepository;
        private readonly ITracksRepository _tracksRepository;
        private readonly IMapper _mapper;

        public TracksController(ITracksRepository tracksRepository, IMapper mapper, IPlaylistsRepository playlistsRepository)
        {
            _tracksRepository = tracksRepository;
            _mapper = mapper;
            _playlistsRepository = playlistsRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<TrackDto>> GetTracksAsync(Guid playlistId)
        {
            var playlist = await _tracksRepository.GetTracksAsync(playlistId);
            return playlist.Select(o => _mapper.Map<TrackDto>(o));
        }

        [HttpGet(template: "{trackId}")]
        public async Task<ActionResult<TrackDto>> GetTrackAsync(Guid playlistId, Guid trackId)
        {
            var track = await _tracksRepository.GetTrackAsync(playlistId, trackId);
            if (track == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<TrackDto>(track));
        }

        [HttpPost]
        public async Task<ActionResult<TrackDto>> PostAsync(Guid userId, Guid playlistId, CreateTrackDto trackDto)
        {
            var playlist = await _playlistsRepository.GetPlaylistsAsync(playlistId);
            if (playlist == null)
            {
                return NotFound($"Couldn't find a playlist with id of {playlistId}");
            }

            var track = _mapper.Map<Track>(trackDto);
            track.PlaylistId = playlistId;

            await _tracksRepository.InsertTrackAsync(track);

            return Created($"/api/users/{userId}/playlists/{playlistId}/tracks/{track.TrackId}", _mapper.Map<TrackDto>(track));
        }

        [HttpDelete("{trackId}")]
        public async Task<ActionResult> DeleteAsync(Guid playlistId, Guid trackId)
        {
            var track = await _tracksRepository.GetTrackAsync(playlistId, trackId);
            if (track == null)
            {
                return NotFound();
            }

            await _tracksRepository.DeleteTrackAsync(track);

            return NoContent();
        }
    }
}
