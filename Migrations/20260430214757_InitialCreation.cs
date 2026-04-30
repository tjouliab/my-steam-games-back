using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace my_steam_games_back.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Statuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    AppId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    IsVisible = table.Column<bool>(type: "INTEGER", nullable: false),
                    ImgIconUrl = table.Column<string>(type: "TEXT", nullable: false),
                    MetacriticScore = table.Column<int>(type: "INTEGER", nullable: false),
                    PositiveReviews = table.Column<int>(type: "INTEGER", nullable: false),
                    NegativeReviews = table.Column<int>(type: "INTEGER", nullable: false),
                    PlayTime = table.Column<int>(type: "INTEGER", nullable: false),
                    LastTimePlayed = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ReleaseDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    InitialPrice = table.Column<int>(type: "INTEGER", nullable: false),
                    StatusId = table.Column<int>(type: "INTEGER", nullable: true),
                    PersonnalScore = table.Column<int>(type: "INTEGER", nullable: true),
                    PersonnalNotes = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.AppId);
                    table.ForeignKey(
                        name: "FK_Games_Statuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "Statuses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GameGenres",
                columns: table => new
                {
                    AppId = table.Column<int>(type: "INTEGER", nullable: false),
                    GenreId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameGenres", x => new { x.AppId, x.GenreId });
                    table.ForeignKey(
                        name: "FK_GameGenres_Games_AppId",
                        column: x => x.AppId,
                        principalTable: "Games",
                        principalColumn: "AppId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameGenres_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Statuses",
                columns: new[] { "Id", "Label" },
                values: new object[,]
                {
                    { 1, "100%" },
                    { 2, "Finished" },
                    { 3, "Unfinished" },
                    { 4, "Abandoned" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameGenres_GenreId",
                table: "GameGenres",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_Games_StatusId",
                table: "Games",
                column: "StatusId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameGenres");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Genres");

            migrationBuilder.DropTable(
                name: "Statuses");
        }
    }
}
