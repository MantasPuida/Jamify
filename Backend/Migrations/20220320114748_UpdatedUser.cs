using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class UpdatedUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "YoutubeUniqueIdentifier");

            migrationBuilder.AddColumn<string>(
                name: "DeezerUniqueIdentifier",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SpotifyUniqueIdentifier",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeezerUniqueIdentifier",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SpotifyUniqueIdentifier",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "YoutubeUniqueIdentifier",
                table: "Users",
                newName: "Name");
        }
    }
}
