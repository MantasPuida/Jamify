using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Dtos.Users
{
    public record CreateUserDto([Required] string Name);
}