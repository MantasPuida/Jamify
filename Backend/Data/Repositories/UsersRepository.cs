using Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Repositories
{
    public interface IUsersRepository
    {
        Task<List<User>> GetUsersAsync();
        Task<User> GetUserAsync(Guid id);
        Task InsertUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
    }

    public class UsersRepository : IUsersRepository
    {
        private readonly BackendContext _context;

        public UsersRepository(BackendContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserAsync(Guid userId)
        {
            return await _context.Users.FirstOrDefaultAsync(o => o.UserId == userId);
        }

        public async Task InsertUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
