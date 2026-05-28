let data = '';
const stdin = process.stdin;
const testPoints = 80;
const ciPoints = 20;
const totalPoints = testPoints + ciPoints;

stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
  data += chunk;
});

stdin.on('end', function () {
  const result = JSON.parse(data);
  const { numPassedTests, numTotalTests } = result;
  const testPointsReceived = Math.ceil(
    (numPassedTests / numTotalTests) * testPoints,
  );
  const lintPoints = process.env.LINT_PASSED === 'true' ? 10 : 0;
  const prettierPoints = process.env.PRETTIER_PASSED === 'true' ? 10 : 0;
  const ciPointsReceived = lintPoints + prettierPoints;
  const output = `
Component | Passed Tests | Total Tests | Points Available | Points Received
--------- | -------- | -------- | -------- | --------
All tests, as originally given, are passing. | ${numPassedTests} | ${numTotalTests} | ${testPoints} | ${testPointsReceived}
Lint passes. | | | 10 | ${lintPoints}
Prettier passes. | | | 10 | ${prettierPoints}
**Total** | | | **${totalPoints}** | **${testPointsReceived + ciPointsReceived}**
`;
  process.stdout.write(output);
});

stdin.on('error', console.error);
