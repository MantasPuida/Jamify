using Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Repositories
{
    public interface IPlaylistsRepository
    {
        Task<List<Playlist>> GetPlaylistsAsync(Guid userId);
        Task<Playlist> GetPlaylistAsync(Guid userId, Guid playlistId);
        Task InsertPlaylistAsync(Playlist playlist);
        Task UpdatePlaylistAsync(Playlist playlist);
        Task DeletePlaylistAsync(Playlist playlist);
    }

    public class PlaylistsRepository : IPlaylistsRepository
    {
        private readonly BackendContext _context;

        public PlaylistsRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<List<Playlist>> GetPlaylistsAsync(Guid userId)
        {
            return await _context.Playlists.Where(o => o.UserId == userId).ToListAsync();
        }

        public async Task<Playlist> GetPlaylistAsync(Guid userId, Guid playlistId)
        {
            return await _context.Playlists.FirstOrDefaultAsync(o => o.PlaylistId == playlistId && o.UserId == userId);
        }

        public async Task InsertPlaylistAsync(Playlist playlist)
        {
            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePlaylistAsync(Playlist playlist)
        {
            _context.Playlists.Update(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePlaylistAsync(Playlist playlist)
        {
            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();
        }
    }
}
