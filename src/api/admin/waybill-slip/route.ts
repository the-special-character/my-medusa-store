import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function GET(
	req: MedusaRequest,
	res: MedusaResponse
): Promise<void> {
	console.log(req);
	const { waybillId } = req.query;

	if (waybillId) {
		try {
			const response = await fetch(
				`https://track.delhivery.com/api/p/packing_slip?wbns=${waybillId}&pdf=true`,
				{
					cache: "no-store",
					headers: {
						Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (!response.ok) {
				res.status(500).json({ msg: waybillId });
			}

			const json = await response.json();

			res.status(200).json({ ...json });
		} catch (error) {
			console.log({ error });
			res.status(500).json({ msg: "error", error });
		}
	} else {
		res.status(400).json({ message: "waybillId is not provided" });
	}
}
