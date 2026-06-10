using Microsoft.AspNetCore.Mvc;
using Neurograph.Services;
using Interfaces;

namespace Controller.Neurograph.main;

[ApiController]
[Route("[controller]")]
public class SimulationController : ControllerBase
{                                                                   //So pra lembrar, DI sempre vem antes dos métodos de ação
    private readonly INeuronBehaviorService _behaviorService;
    private readonly INeuronResetService _resetService;

    public SimulationController(
        INeuronBehaviorService behaviorService,
        INeuronResetService resetService)
    {
        _behaviorService = behaviorService;
        _resetService = resetService;
    }

    [HttpPost("tick")]
    public async Task<IActionResult> RunTick()
    {
        await _behaviorService.RunTickAsync();
        return Ok(new { message = "Tick processado com sucesso" });
    }

    [HttpDelete("reset")]
    public async Task<IActionResult> Reset()
    {
        await _resetService.ResetAllAsync();
        return Ok(new { message = "Simulação resetada. Logs preservados." });
    }
}