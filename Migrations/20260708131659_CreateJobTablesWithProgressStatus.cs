using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace my_steam_games_back.Migrations
{
    /// <inheritdoc />
    public partial class CreateJobTablesWithProgressStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProgressStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PopulateJob",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProgressStatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    StartAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FinishedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TotalGames = table.Column<int>(type: "INTEGER", nullable: false),
                    FailedGames = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PopulateJob", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PopulateJob_ProgressStatus_ProgressStatusId",
                        column: x => x.ProgressStatusId,
                        principalTable: "ProgressStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PopulateJobItem",
                columns: table => new
                {
                    JobId = table.Column<int>(type: "INTEGER", nullable: false),
                    AppId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProgressStatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    Attempts = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PopulateJobItem", x => new { x.JobId, x.AppId });
                    table.ForeignKey(
                        name: "FK_PopulateJobItem_PopulateJob_JobId",
                        column: x => x.JobId,
                        principalTable: "PopulateJob",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PopulateJobItem_ProgressStatus_ProgressStatusId",
                        column: x => x.ProgressStatusId,
                        principalTable: "ProgressStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ProgressStatus",
                columns: new[] { "Id", "Label" },
                values: new object[,]
                {
                    { 1, "Pending" },
                    { 2, "Running" },
                    { 3, "Completed" },
                    { 4, "Failed" },
                    { 5, "Canceled" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PopulateJob_ProgressStatusId",
                table: "PopulateJob",
                column: "ProgressStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_PopulateJobItem_ProgressStatusId",
                table: "PopulateJobItem",
                column: "ProgressStatusId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PopulateJobItem");

            migrationBuilder.DropTable(
                name: "PopulateJob");

            migrationBuilder.DropTable(
                name: "ProgressStatus");
        }
    }
}
