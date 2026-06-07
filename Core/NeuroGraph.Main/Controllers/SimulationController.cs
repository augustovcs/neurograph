using Microsoft.AspNetCore.Mvc;
using Neurograph.Services;

namespace Controller.Neurograph.main;


[ApiController]
[Route("[controller]")]
public class SimulationController : ControllerBase
{
   
    private readonly INeuronBehaviorService _behaviorService;

    public SimulationController(INeuronBehaviorService behaviorService)
    {
        _behaviorService = behaviorService;
    }

    [HttpPost("tick")]
    public async Task<IActionResult> RunTick()
    {
        await _behaviorService.RunTickAsync();
        return Ok(new { message = "Tick processado com sucesso" });
    }
}
