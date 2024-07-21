
// analyze per bench
// bench1, bench2 ....

const process = require('process');
const fs = require('node:fs');


const formattedServerNames = {
  "tailcall": "Tailcall",
  "gqlgen": "Gqlgen",
  "apollo": "Apollo GraphQL",
  "netflix_dgs": "Netflix DGS",
  "caliban": "Caliban",
  "async_graphql": "async-graphql",
  "hasura": "Hasura",
  "graphql_jit": "GraphQL JIT"
};

const args = process.argv;
const args_benchwise = []
const args_of_nth_bench = [];
args.forEach((arg) => {
  args_of_nth_bench.push(arg);
  if (arg == "_") {
    args_benchwise.push = args_benchwise[bench_number].push(arg);
    args_of_nth_bench = [];
  };

});

// lets create bar charts, mardown table 
// to show the results/metrics
let markdownTable = "\n";

const tableColumns = ["Query", "Server", "Requests/sec", "Latency (ms)", "Relative"];
// prepare tableHeader markdown syntax
let markdownTableHeader = "";
let markdownTableHeaderConfig = "";
tableColumns.forEach((column) => {
  markdownTableHeaderConfig += "|" + "-"*(2 + column.length) + ":";
  markdownTableHeader += "| " + column + " ";
});
markdownTableHeader += "|\n";
markdownTableHeaderConfig += "|\n"
markdownTable += (markdownTableHeader + markdownTableHeaderConfig);


args_benchwise.forEach((args) => {

  const bench = args.at(0).split("__").at(1);

  const result_files = args;

  const metrics_per_run = { "Requests/sec": [], "Latency": [] };

  //  example result_file: bench1_result1_graphql_tailcall_run.sh.txt
  result_files.forEach((result_file) => {
    const server = result_file.split("__").at(3);
    // read result_file
    fs.readFile(result_file, (error, data) => {

      if (error) { console.log(error); return; }

      // if no error
      const latency_regex = '/Latency\s+([\d\.]+)ms/'
      const requests_per_sec_regex = '/Requests\/sec:\s+([\d\.]+)/'
      const reqs_sec = data.match(requests_per_sec_regex);
      // latency in ms
      const latency = data.match(latency_regex);
      if (!Object.keys(metrics_per_run).includes(server)) {
        metrics_per_run[server] = {}
      }
      metrics_per_run[server]["Requests/sec"] = metrics_per_run["Requests/sec"].push(reqs_sec);
      metrics_per_run[server]["Latency"] = metrics_per_run["Latency"].push(latency);
    });
  });


  // calculate avg for each server
  const avg_metrics = {}
  const servers = Object.keys(metrics_per_run);
  servers.forEach(server => {
    avg_metrics[server] = {
      "Requests/sec": metrics_per_run["Requests/sec"].reduce((a, b) => { a + b }, 0),
      "Latency": metrics_per_run["Latency"].reduce((a, b) => { a + b }, 0)
    };
  });

  const reqs_per_sec_data = Object.entries(avg_metrics).map(([server, avg]) => [server, avg["Requests/sec"]]);
  const latency_data = Object.entries(avg_metrics).map(([server, avg]) => [server, avg["Latency"]]);
  
  const bench_queries = {
    1: "{ posts { id userId title user { id name email }}} 	",
    2: "{ posts { title }}",
    3: "{ greet }"
  };

  // now insert a row with two columns representing
  let markdownTableBenchRow = "| " + bench + " | `" + bench_queries[bench] + "` |\n";

  let markdownTableRows_for_nth_bench = markdownTableBenchRow;
  servers.forEach((server) => {
    // to be calculated
    const relative = 0;
    const dataRow = "|| " + "[" + formattedServerNames[server] + "]" + " | `" + reqs_per_sec_data[server] + "` | `" + latency_data[server] + "` | `" + relative + "` |\n";
    markdownTableRows_for_nth_bench += dataRow;
  });
  markdownTable += markdownTableBenchRow;
  markdownTable += markdownTableRows_for_nth_bench;
});


// finally
console.log(markdownTable);