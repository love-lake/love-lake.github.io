const blue = "rgb(107,150,207)";

const flags = [
	{
		label: "Love Lake",
		size: 18,
		coordinates: [-92.326621, 45.973319],
	},
	{
		label: "Falk Lake",
		size: 9,
		coordinates: [-92.317706, 45.978188],
	},
];

const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3
	.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

const projection = d3.geo
	.albers()
	.scale(1755000)
	.center([0, 45.972812])
	.rotate([92.323406, 0])
	.translate([width / 2, height / 2]);

const path = d3.geo.path().projection(projection);

d3.json("assets/js/lakes.geo.json", function(error, geo) {
	svg.selectAll("path")
		.data(geo.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill", "transparent")
		.style("stroke", blue)
		.style("stroke-width", 1);

	const circles = svg
		.selectAll("circle")
		.data(Object.keys(window._cabins))
		.enter()
		.append("circle")
		.attr(
			"cx",
			(d) =>
				projection([
					window._cabins[d].longitude,
					window._cabins[d].latitude,
				])[0]
		)
		.attr(
			"cy",
			(d) =>
				projection([
					window._cabins[d].longitude,
					window._cabins[d].latitude,
				])[1]
		)
		.attr("r", 6)
		.style("cursor", "pointer")
		.style("fill", blue);
	circles.on("mouseover", function() {
		d3.select(this).attr("r", 12);
	});
	circles.on("mouseout", function() {
		d3.select(this).attr("r", 6);
	});
	circles.on("click", (d) => {
		window.location.href = `/cabins/${d}.html`;
	});

	svg.selectAll("text")
		.data(flags)
		.enter()
		.append("text")
		.text((d) => d.label)
		.attr("text-anchor", "middle")
		.attr("x", (d) => projection(d.coordinates)[0])
		.attr("y", (d) => projection(d.coordinates)[1])
		.style("fill", blue)
		.style("font-family", "Montserrat")
		.style("font-size", (d) => d.size + "px")
		.style("font-weight", 800)
		.style("text-transform", "uppercase");
});
