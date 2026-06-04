using Microsoft.EntityFrameworkCore;

namespace NeuroGraph.Main.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Os DbSet<> (tabelas) entram aqui na PRÓXIMA issue.
}