using Microsoft.EntityFrameworkCore;
using MySteamGames.Core.Entities;
using MySteamGames.Infrastructure.Persistence.Data;

namespace MySteamGames.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public DbSet<GameEntity> Games => Set<GameEntity>();
    public DbSet<GenreEntity> Genres => Set<GenreEntity>();
    public DbSet<TagEntity> Tags => Set<TagEntity>();
    public DbSet<StatusEntity> Statuses => Set<StatusEntity>();
    public DbSet<VisibilityEntity> Visibility => Set<VisibilityEntity>();
    public DbSet<ProgressStatusEntity> ProgressStatus => Set<ProgressStatusEntity>();
    public DbSet<PopulateJobEntity> PopulateJob => Set<PopulateJobEntity>();
    public DbSet<PopulateJobItemEntity> PopulateJobItem => Set<PopulateJobItemEntity>();

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

        modelBuilder.Entity<GameEntity>()
            .HasOne(g => g.Visibility)
            .WithMany()
            .HasForeignKey(g => g.VisibilityId);

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

        modelBuilder.Entity<PopulateJobEntity>()
            .HasKey(j => j.Id);

        modelBuilder.Entity<PopulateJobEntity>()
            .HasOne(g => g.ProgressStatus)
            .WithMany()
            .HasForeignKey(g => g.ProgressStatusId);

        modelBuilder.Entity<PopulateJobEntity>()
            .HasMany(j => j.JobItems)
            .WithOne(j => j.Job)
            .HasForeignKey(j => j.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        // No need to define a FK with the Game table since no join will be done
        modelBuilder.Entity<PopulateJobItemEntity>()
            .HasKey(j => new { j.JobId, j.AppId });

        modelBuilder.Entity<PopulateJobItemEntity>()
            .HasOne(g => g.ProgressStatus)
            .WithMany()
            .HasForeignKey(g => g.ProgressStatusId);

        modelBuilder.Entity<PopulateJobItemEntity>()
            .HasOne(j => j.Job)
            .WithMany(j => j.JobItems)
            .HasForeignKey(j => j.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<StatusEntity>().HasData(
            StatusEntityEnum.Completed,
            StatusEntityEnum.Finished,
            StatusEntityEnum.Unfinished,
            StatusEntityEnum.Abandoned
        );

        modelBuilder.Entity<VisibilityEntity>().HasData(
            VisibilityEntityEnum.Visible,
            VisibilityEntityEnum.HiddenManually,
            VisibilityEntityEnum.HiddenDefault
        );

        modelBuilder.Entity<ProgressStatusEntity>().HasData(
            ProgressStatusEntityEnum.Pending,
            ProgressStatusEntityEnum.Running,
            ProgressStatusEntityEnum.Completed,
            ProgressStatusEntityEnum.Failed,
            ProgressStatusEntityEnum.Canceled
        );
    }
}