using Microsoft.AspNetCore.Mvc;
using NeuroGraph.Main.Data;
using NeuroGraph.Main.Dtos;
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
    public async Task<ActionResult<IEnumerable<LongevityDto>>> GetLongevity()
    {
        var data = await _db.NeuronLongevity
            .Select(v => new LongevityDto(v.NeuronId, v.Label, v.LifetimeSeconds, v.EvolutionCount))
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("deaths")]
    public async Task<ActionResult<IEnumerable<DeathStatsDto>>> GetDeaths()
    {
        var data = await _db.NeuronDeathStats
            .Select(v => new DeathStatsDto(v.Cause, v.DeathCount))
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("best-events")]
    public async Task<ActionResult<IEnumerable<BestEventDto>>> GetBestEvents()
    {
        var data = await _db.BestEvents
            .Select(v => new BestEventDto(v.EventId, v.NeuronId, v.Kind, v.Cause, v.OccurredAt))
            .ToListAsync();
        return Ok(data);
    }
}
