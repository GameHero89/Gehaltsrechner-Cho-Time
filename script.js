// script.js
document.addEventListener('DOMContentLoaded', function() {
    const hoursCalculationRadios = document.querySelectorAll('input[name="hoursCalculation"]');
    hoursCalculationRadios.forEach(radio => radio.addEventListener('change', handleHoursInputType));
    handleHoursInputType(); // Initialize on page load
});

function handleHoursInputType() {
    const isMonthly = document.querySelector('input[name="hoursCalculation"]:checked').value === 'monthly';
    document.getElementById('dailyInputs').style.display = isMonthly ? 'none' : 'block';
    document.getElementById('monthlyInputs').style.display = isMonthly ? 'block' : 'none';
    document.getElementById('hourAdjustmentFieldset').style.display = isMonthly ? 'none' : 'block';
}

function calculateSalary() {
    const baseSalary = parseFloat(document.getElementById('baseSalary').value);
    const isMonthly = document.querySelector('input[name="hoursCalculation"]:checked').value === 'monthly';
    let totalHours = isMonthly ? parseFloat(document.getElementById('totalMonthlyHours').value) : calculateDailyTotalHours();
    
    // Estimate working days from total hours if monthly hours are used
    let workingDays = isMonthly ? Math.ceil(totalHours / 8) : parseInt(document.getElementById('workingDays').value) || 1; // Default to 1 to avoid division by zero

    const takesCalculationType = document.querySelector('input[name="takesCalculation"]:checked').value;
    const takes = parseFloat(document.getElementById('takes').value);
    let totalTakes = takesCalculationType === 'average' ? takes * workingDays : takes;

    const commissionPerTake = parseFloat(document.getElementById('commissionPerTake').value);
    const cancellationRate = parseFloat(document.getElementById('cancellationRate').value) || 0;
    const totalCommission = totalTakes * commissionPerTake * (1 - cancellationRate / 100);
    const totalBasePay = baseSalary * totalHours;
    const totalSalary = totalBasePay + totalCommission;

    const averageCommissionPerDay = totalCommission / workingDays;
    const averageCommissionPerHour = totalCommission / totalHours;

    document.getElementById('result').textContent = totalSalary.toFixed(2);
    document.getElementById('basePayOutput').textContent = totalBasePay.toFixed(2);
    document.getElementById('commissionOutput').textContent = totalCommission.toFixed(2);
    document.getElementById('averageCommissionPerDay').textContent = averageCommissionPerDay.toFixed(2);
    document.getElementById('averageCommissionPerHour').textContent = averageCommissionPerHour.toFixed(2);
}

function calculateDailyTotalHours() {
    const workingDays = parseInt(document.getElementById('workingDays').value);
    const hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value);
    const adjustmentType = document.querySelector('input[name="hourAdjustment"]:checked').value;
    const adjustmentHours = parseFloat(document.getElementById('adjustmentHours').value) || 0;
    return (workingDays * hoursPerDay) + (adjustmentType === 'plus' ? adjustmentHours : -adjustmentHours);
}

function copySalary() {
    const salaryText = document.getElementById('result').textContent.replace('.', ',');
    navigator.clipboard.writeText(salaryText)
    .then(() => alert('Gehalt kopiert: ' + salaryText))
    .catch(err => alert('Fehler beim Kopieren: ' + err));
}

function openLink() {
    window.open('https://www.gehalt.de/einkommen/brutto-netto-rechner', '_blank');
}
