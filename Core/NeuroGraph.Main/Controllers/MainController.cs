using Microsoft.AspNetCore.Mvc;
using NeuroGraph.Main.Data;
using NeuroGraph.Main.Dtos;
using Microsoft.EntityFrameworkCore;

namespace NeuroGraph.Main.Controllers;

[ApiController]
[Route("api/pages")]
[Tags("Pages")]
public class MainController : ControllerBase
{
    private readonly AppDbContext _db;

    public MainController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("MainPageData")]
    public async Task<ActionResult<MainPageDataDto>> GetMainPageData()
    {
        var oneMinuteAgo = DateTime.UtcNow.AddMinutes(-1);

        var activeNeurons = await _db.Neurons.CountAsync(n => n.Status != "dead");
        var propagatedSignals = await _db.BiologicalSignals.CountAsync();
        var neuralConnections = await _db.NeuralConnections.CountAsync();
        var eventsPerMinute = await _db.BiologicalEvents.CountAsync(e => e.OccurredAt >= oneMinuteAgo);

        var data = new MainPageDataDto(
            activeNeurons,
            propagatedSignals,
            neuralConnections,
            eventsPerMinute);

        return Ok(data);
    }
}
