using Microsoft.EntityFrameworkCore;
using MySteamGamesBack.Data.Entities;

namespace MySteamGamesBack.Data;

public class AppDbContext : DbContext
{
    public DbSet<GameEntity> Games => Set<GameEntity>();
    public DbSet<GenreEntity> Genres => Set<GenreEntity>();
    public DbSet<StatusEntity> Statuses => Set<StatusEntity>();

    public DbSet<GameGenreEntity> GameGenres => Set<GameGenreEntity>();

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=steam-games.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GameEntity>()
            .HasKey(g => g.AppId);

        modelBuilder.Entity<GameEntity>()
            .HasOne(g => g.Status)
            .WithMany()
            .HasForeignKey(g => g.StatusId);

        modelBuilder.Entity<GenreEntity>()
            .HasKey(g => g.Id);

        modelBuilder.Entity<StatusEntity>().HasData(
            new StatusEntity { Id = 1, Label = "100%" },
            new StatusEntity { Id = 2, Label = "Finished" },
            new StatusEntity { Id = 3, Label = "Unfinished" },
            new StatusEntity { Id = 4, Label = "Abandoned" }
        );

        modelBuilder.Entity<GameGenreEntity>()
            .HasKey(gg => new { gg.AppId, gg.GenreId });

        modelBuilder.Entity<GameGenreEntity>()
            .HasOne(gg => gg.Game)
            .WithMany(g => g.GameGenres)
            .HasForeignKey(gg => gg.AppId);

        modelBuilder.Entity<GameGenreEntity>()
            .HasOne(gg => gg.Genre)
            .WithMany(g => g.GameGenres)
            .HasForeignKey(gg => gg.GenreId);
    }
}