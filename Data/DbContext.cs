using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class AppDbContext : DbContext
{
    public DbSet<GameEntity> Games => Set<GameEntity>();
    public DbSet<GenreEntity> Genres => Set<GenreEntity>();
    public DbSet<StatusEntity> Statuses => Set<StatusEntity>();

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

        // Skip navigation: declare join table GameGenre
        modelBuilder.Entity<GameEntity>()
            .HasMany(g => g.Genres)
            .WithMany(g => g.Games)
            .UsingEntity<Dictionary<string, object>>(
                "GameGenre",
                j => j.HasOne<GenreEntity>()
                    .WithMany()
                    .HasForeignKey("GenreId"),
                j => j.HasOne<GameEntity>()
                    .WithMany()
                    .HasForeignKey("GameId"),
                j => j.HasKey("GameId", "GenreId")
            );

        modelBuilder.Entity<GenreEntity>()
            .HasKey(g => g.AppId);

        modelBuilder.Entity<StatusEntity>().HasData(
            new StatusEntity { Id = 1, Label = "100%" },
            new StatusEntity { Id = 2, Label = "Finished" },
            new StatusEntity { Id = 3, Label = "Unfinished" },
            new StatusEntity { Id = 4, Label = "Abandoned" }
        );
    }
}