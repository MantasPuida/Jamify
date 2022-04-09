using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class UpdatedTrackModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TrackSource",
                table: "Tracks",
                newName: "Duration");

            migrationBuilder.RenameColumn(
                name: "TrackDescription",
                table: "Tracks",
                newName: "Artists");

            migrationBuilder.AddColumn<string>(
                name: "Album",
                table: "Tracks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Album",
                table: "Tracks");

            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Tracks",
                newName: "TrackSource");

            migrationBuilder.RenameColumn(
                name: "Artists",
                table: "Tracks",
                newName: "TrackDescription");
        }
    }
}
