using MySteamGamesBack.Models;
using MySteamGamesBack.Services;

var builder = WebApplication.CreateBuilder(args);

// Register controllers and application services
builder.Services.AddControllers();
builder.Services.Configure<SteamOptions>(builder.Configuration.GetSection("Steam"));
builder.Services.AddScoped<ISteamService, SteamService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
