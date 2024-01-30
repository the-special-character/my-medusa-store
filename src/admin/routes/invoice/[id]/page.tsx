import { useParams } from "react-router-dom";
import { MedusaProvider } from "medusa-react";
import { QueryClient } from "@tanstack/react-query";
import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { useAdminOrder } from "medusa-react";

const queryClient = new QueryClient();

const styles = StyleSheet.create({
	page: {
		flexDirection: "row",
		backgroundColor: "#E4E4E4",
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1,
	},
});

const MyDocument = () => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.section}>
				<Text>Section #1</Text>
			</View>
			<View style={styles.section}>
				<Text>Section #2</Text>
			</View>
		</Page>
	</Document>
);

const PDF = ({ id }) => {
	const order = useAdminOrder(id);

	console.log(order);

	return (
		<PDFViewer>
			<MyDocument />
		</PDFViewer>
	);
};

const CustomPage = () => {
	const { id } = useParams();

	return (
		<MedusaProvider
			queryClientProviderProps={{ client: queryClient }}
			baseUrl="http://localhost:9000"
			// publishableApiKey="pk_01HJNPAHAKHTJSA0AV0PJY71F5"
		>
			<PDF id={id} />
		</MedusaProvider>
	);
};

export default CustomPage;
