using Microsoft.AspNetCore.Mvc;
using NeuroGraph.Main.Data;
using NeuroGraph.Main.Entities.Views;
using Microsoft.EntityFrameworkCore;

namespace NeuroGraph.Main.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StatisticsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("longevity")]
    public async Task<ActionResult<IEnumerable<NeuronLongevityView>>> GetLongevity()
    {
        var data = await _db.NeuronLongevity.ToListAsync();
        return Ok(data);
    }

    [HttpGet("deaths")]
    public async Task<ActionResult<IEnumerable<NeuronDeathStatsView>>> GetDeaths()
    {
        var data = await _db.NeuronDeathStats.ToListAsync();
        return Ok(data);
    }

    [HttpGet("best-events")]
    public async Task<ActionResult<IEnumerable<BestEventView>>> GetBestEvents()
    {
        var data = await _db.BestEvents.ToListAsync();
        return Ok(data);
    }
}