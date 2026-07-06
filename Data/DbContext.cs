using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class AppDbContext : DbContext
{
    public DbSet<GameEntity> Games => Set<GameEntity>();
    public DbSet<GenreEntity> Genres => Set<GenreEntity>();
    public DbSet<TagEntity> Tags => Set<TagEntity>();
    public DbSet<StatusEntity> Statuses => Set<StatusEntity>();
    public DbSet<VisibilityEntity> Visibility => Set<VisibilityEntity>();

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

        // Skip navigation: declare join table GameTag
        modelBuilder.Entity<GameEntity>()
            .HasMany(g => g.Tags)
            .WithMany(g => g.Games)
            .UsingEntity<Dictionary<string, object>>(
                "GameTag",
                j => j.HasOne<TagEntity>()
                    .WithMany()
                    .HasForeignKey("TagId"),
                j => j.HasOne<GameEntity>()
                    .WithMany()
                    .HasForeignKey("GameId"),
                j => j.HasKey("GameId", "TagId")
            );

        modelBuilder.Entity<GenreEntity>()
            .HasKey(g => g.AppId);

        modelBuilder.Entity<TagEntity>()
            .HasKey(g => g.Id);

        modelBuilder.Entity<StatusEntity>().HasData(
            StatusesEnum.Completed,
            StatusesEnum.Finished,
            StatusesEnum.Unfinished,
            StatusesEnum.Abandoned
        );

        modelBuilder.Entity<VisibilityEntity>().HasData(
            VisibilityEnum.Visible,
            VisibilityEnum.HiddenManually,
            VisibilityEnum.HiddenDefault
        );
    }
}