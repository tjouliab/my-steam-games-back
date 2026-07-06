using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace my_steam_games_back.Migrations
{
    /// <inheritdoc />
    public partial class CreateVisibilityTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsVisible",
                table: "Games",
                newName: "VisibilityId");

            migrationBuilder.CreateTable(
                name: "Visibility",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visibility", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Visibility",
                columns: new[] { "Id", "Label" },
                values: new object[,]
                {
                    { 1, "Visible" },
                    { 2, "Hidden Manually" },
                    { 3, "Hidden Default" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_VisibilityId",
                table: "Games",
                column: "VisibilityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Visibility_VisibilityId",
                table: "Games",
                column: "VisibilityId",
                principalTable: "Visibility",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Visibility_VisibilityId",
                table: "Games");

            migrationBuilder.DropTable(
                name: "Visibility");

            migrationBuilder.DropIndex(
                name: "IX_Games_VisibilityId",
                table: "Games");

            migrationBuilder.RenameColumn(
                name: "VisibilityId",
                table: "Games",
                newName: "IsVisible");
        }
    }
}
