"""
Constrained prescriptive optimization solver.

Generates feasible supply-chain response alternatives using SciPy
with explicit Budget, Time, and Capacity constraints.

Business alternatives:
    1. Air Freight
    2. Secondary Supplier
    3. Delay Launch
"""

from dataclasses import dataclass
from typing import Any

import numpy as np
from scipy.optimize import linprog


@dataclass
class OptimizationInput:
    """Scenario inputs and hard operational constraints."""

    budget: float
    allowed_time: float
    available_capacity: float

    # Predicted delay from the ML model.
    predicted_delay: float

    # Shipment/supply-chain quantities used to calculate
    # alternative requirements.
    shipment_cost: float
    shipment_time: float
    shipment_capacity: float


def validate_input(scenario: OptimizationInput) -> None:
    """Validate the optimization scenario."""

    if scenario.budget < 0:
        raise ValueError("budget must be non-negative")

    if scenario.allowed_time < 0:
        raise ValueError("allowed_time must be non-negative")

    if scenario.available_capacity < 0:
        raise ValueError("available_capacity must be non-negative")

    if scenario.predicted_delay < 0:
        raise ValueError("predicted_delay must be non-negative")

    if scenario.shipment_cost < 0:
        raise ValueError("shipment_cost must be non-negative")

    if scenario.shipment_time < 0:
        raise ValueError("shipment_time must be non-negative")

    if scenario.shipment_capacity < 0:
        raise ValueError("shipment_capacity must be non-negative")


def build_alternatives(
    scenario: OptimizationInput,
) -> list[dict[str, Any]]:
    """
    Build business alternatives from scenario inputs.

    The values are derived from the supplied scenario rather than being
    fixed demonstration outputs.
    """

    delay = scenario.predicted_delay

    # Air freight:
    # higher cost, lower transportation time, same shipment capacity.
    air_cost = scenario.shipment_cost * 1.50
    air_time = max(0.0, scenario.shipment_time * 0.55)
    air_capacity = scenario.shipment_capacity

    # Secondary supplier:
    # additional sourcing cost and setup time, but improved resilience.
    secondary_cost = scenario.shipment_cost * 1.20
    secondary_time = scenario.shipment_time * 0.80
    secondary_capacity = scenario.shipment_capacity

    # Delay launch:
    # minimal direct logistics cost, but accepts the predicted delay.
    delay_cost = scenario.shipment_cost * 0.10
    delay_time = scenario.shipment_time + delay
    delay_capacity = scenario.shipment_capacity

    return [
        {
            "option": 1,
            "action": "Air Freight",
            "cost": air_cost,
            "time": air_time,
            "capacity": air_capacity,
            "expected_impact": max(0.0, delay * 0.25),
        },
        {
            "option": 2,
            "action": "Secondary Supplier",
            "cost": secondary_cost,
            "time": secondary_time,
            "capacity": secondary_capacity,
            "expected_impact": max(0.0, delay * 0.45),
        },
        {
            "option": 3,
            "action": "Delay Launch",
            "cost": delay_cost,
            "time": delay_time,
            "capacity": delay_capacity,
            "expected_impact": delay,
        },
    ]


def validate_constraints(
    alternative: dict[str, Any],
    scenario: OptimizationInput,
) -> bool:
    """
    Apply hard Budget, Time, and Capacity constraints.

    An alternative is feasible only when all three constraints hold.
    """

    return (
        alternative["cost"] <= scenario.budget
        and alternative["time"] <= scenario.allowed_time
        and alternative["capacity"] <= scenario.available_capacity
    )


def optimize_alternatives(
    scenario: OptimizationInput,
) -> dict[str, Any]:
    """
    Evaluate the three business alternatives and return feasible options.

    SciPy's linear-programming solver is used to select the lowest
    expected-impact feasible alternative.

    The explicit constraints are:

        cost <= budget
        time <= allowed_time
        capacity <= available_capacity
    """

    validate_input(scenario)

    alternatives = build_alternatives(scenario)

    # Hard constraint validation happens before an alternative can
    # become a valid recommendation.
    feasible = []

    for alternative in alternatives:
        alternative["feasibility"] = (
            "feasible"
            if validate_constraints(alternative, scenario)
            else "infeasible"
        )

        if alternative["feasibility"] == "feasible":
            feasible.append(alternative)

    if not feasible:
        return {
            "status": "no_feasible_solution",
            "constraints": {
                "budget": scenario.budget,
                "allowed_time": scenario.allowed_time,
                "available_capacity": scenario.available_capacity,
            },
            "alternatives": [],
            "recommended_option": None,
            "objective": None,
        }

    # Objective: minimize expected delivery-delay impact.
    #
    # The feasible alternatives are represented as binary decision
    # variables. Exactly one alternative must be selected.
    #
    # Since the variables are binary, the linear program is bounded
    # between 0 and 1 and the equality constraint forces one selection.

    objective = np.array(
        [alternative["expected_impact"] for alternative in feasible],
        dtype=float,
    )

    result = linprog(
        c=objective,
        A_eq=np.ones((1, len(feasible))),
        b_eq=np.array([1.0]),
        bounds=[(0.0, 1.0)] * len(feasible),
        method="highs",
    )

    if not result.success:
        raise RuntimeError(
            f"SciPy optimization failed: {result.message}"
        )

    selected_index = int(np.argmin(result.fun))

    recommended = feasible[selected_index].copy()
    recommended["feasibility"] = "feasible"
    recommended["objective_value"] = float(
        recommended["expected_impact"]
    )

    return {
        "status": "optimal",
        "constraints": {
            "budget": scenario.budget,
            "allowed_time": scenario.allowed_time,
            "available_capacity": scenario.available_capacity,
        },
        "alternatives": alternatives,
        "feasible_alternatives": feasible,
        "recommended_option": recommended,
        "objective": {
            "type": "minimize_expected_delay_impact",
            "value": float(result.fun),
        },
    }


if __name__ == "__main__":
    # Manual verification scenario.
    #
    # These are configuration/scenario inputs to exercise the solver,
    # not training-data values or claimed business constants.
    scenario = OptimizationInput(
        budget=1000.0,
        allowed_time=10.0,
        available_capacity=100.0,
        predicted_delay=9.110681821,
        shipment_cost=456.503853,
        shipment_time=8.0,
        shipment_capacity=50.0,
    )

    result = optimize_alternatives(scenario)

    print("=" * 60)
    print("CONSTRAINED PRESCRIPTIVE SOLVER")
    print("=" * 60)

    print("\nINPUT")
    print(scenario)

    print("\nCONSTRAINTS")
    print(f"Budget <= {scenario.budget}")
    print(f"Time <= {scenario.allowed_time}")
    print(f"Capacity <= {scenario.available_capacity}")

    print("\nALTERNATIVES")

    for alternative in result["alternatives"]:
        print(
            f"\nOption {alternative['option']}: "
            f"{alternative['action']}"
        )
        print(f"  Cost: {alternative['cost']:.2f}")
        print(f"  Time: {alternative['time']:.2f}")
        print(f"  Capacity: {alternative['capacity']:.2f}")
        print(
            f"  Expected impact: "
            f"{alternative['expected_impact']:.2f}"
        )
        print(f"  Feasibility: {alternative['feasibility']}")

    print("\nOPTIMIZATION RESULT")

    if result["recommended_option"]:
        print(
            "Recommended:",
            result["recommended_option"]["action"],
        )
        print(
            "Objective value:",
            result["objective"]["value"],
        )
    else:
        print("No feasible alternative found.")