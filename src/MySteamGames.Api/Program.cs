using MySteamGames.Core.Interfaces.Repositories;
using MySteamGames.Core.Interfaces.Services;
using MySteamGames.Core.Models;
using MySteamGames.Infrastructure.Persistence;
using MySteamGames.Infrastructure.Persistence.Repositories;
using MySteamGames.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Register controllers and application services
builder.Services.AddControllers();
builder.Services.Configure<SteamOptions>(builder.Configuration.GetSection("Steam"));
builder.Services.AddScoped<ISteamService, SteamService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IGenreService, GenreService>();

builder.Services.AddScoped<AppDbContext, AppDbContext>();
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<IGenreRepository, GenreRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseWebSockets();

app.MapControllers();

app.Run();
