using MySteamGamesBack.Data;
using MySteamGamesBack.Models;
using MySteamGamesBack.Services;

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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
