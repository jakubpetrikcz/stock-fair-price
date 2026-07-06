const cron = require('node-cron');
const pool = require('./db.js');
const { spawn } = require('child_process');

const task = async () => {
  console.log('Running a scheduled task at:', new Date());

  let output = '';

  try {
    const data = await pool.query('SELECT * FROM sec_companies ORDER BY ID');
    const rows = data.rows.slice(0, 5);

    const python = spawn('python3', ['./api/get_financial_data.py']);

    python.stdin.write(JSON.stringify(rows));
    python.stdin.end();

    python.stdout.on('data', (data) => {
      console.log(`Python: ${data.toString()}`);
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`Python error: ${data.toString()}`);
    });

    python.on('close', async (code) => {
      console.log(`Python process exited with code ${code}`);
      const result = JSON.parse(output);
      for (const row of result) {
        await pool.query(
          `
            UPDATE sec_companies
            SET
              cash_equivalents = $1,
              total_debt = $2,
              free_cash_flow = $3,
              shares_outstanding = $4
            WHERE ticker = $5
          `,
          [
            row["cash_equivalents"],
            row["total_debt"],
            JSON.stringify(row["free_cash_flow"]),
            row["shares_outstanding"],
            row.ticker,
          ],
        );
      }
    });
  } catch (error) {
    console.error(error);
  }
};

cron.schedule('* * * * *', task);
