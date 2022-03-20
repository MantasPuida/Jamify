using Backend.Data;
using Backend.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BackendContext>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddControllers();
builder.Services.AddTransient<IUsersRepository, UsersRepository>();
builder.Services.AddTransient<IPlaylistsRepository, PlaylistsRepository>();
builder.Services.AddTransient<ITracksRepository, TracksRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

app.UseEndpoints(endpoints => {
    endpoints.MapControllers();
});

app.Run();
