using Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Repositories
{
    public interface ITracksRepository
    {
        Task<List<Track>> GetTracksAsync(Guid playlistId);
        Task<Track> GetTrackAsync(Guid playlistId, Guid trackId);
        Task InsertTrackAsync(Track track);
        Task DeleteTrackAsync(Track track);
    }

    public class TracksRepository : ITracksRepository
    {
        private readonly BackendContext _context;

        public TracksRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<List<Track>> GetTracksAsync(Guid playlistId)
        {
            return await _context.Tracks.Where(o => o.PlaylistId == playlistId).ToListAsync();
        }

        public async Task<Track> GetTrackAsync(Guid playlistId, Guid trackId)
        {
            return await _context.Tracks.FirstOrDefaultAsync(o => o.PlaylistId == playlistId && o.TrackId == trackId);
        }

        public async Task InsertTrackAsync(Track track)
        {
            _context.Tracks.Add(track);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTrackAsync(Track track)
        {
            _context.Tracks.Remove(track);
            await _context.SaveChangesAsync();
        }
    }
}
