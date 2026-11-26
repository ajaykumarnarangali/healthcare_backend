import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({
    path: "../.env"
});

const hospitalData = [
    {
        name: "Aster MIMS Hospital",
        email: "info@astermims.com",
        phone: "+91 495 248 8000",
        website: "https://www.asterhospitals.in",
        description: "A multi-specialty hospital providing comprehensive healthcare services, advanced medical treatments, emergency care, and specialized medical consultations.",
        image_url: "https://res.cloudinary.com/dhcc5cqej/image/upload/v1794377544/healthcare/hospitals/d2182777-3170-4da2-a55d-47460b3fdd5e.webp",
        image_public_id: "healthcare/hospitals/d2182777-3170-4da2-a55d-47460b3fdd5e",
        status: "ACTIVE",
        street_address: "Govindapuram, Mini Bypass Road",
        city: "Kozhikode",
        state: "Kerala",
        country: "India",
        postal_code: "673014",
        latitude: 11.2588,
        longitude: 75.7804
    },
    {
        name: "Malabar Care Hospital",
        email: "contact@malabarcare.example",
        phone: "+919876543210",
        website: "https://www.malabarcare.example",
        description: "Malabar Care Hospital is a multi-speciality healthcare centre providing quality medical services, advanced diagnostics, and compassionate patient care.",
        image_url: "https://res.cloudinary.com/dhcc5cqej/image/upload/v1794553542/healthcare/hospitals/6567e6a0-4496-428b-a4df-d325df70b9fa.webp",
        image_public_id: "healthcare/hospitals/6567e6a0-4496-428b-a4df-d325df70b9fa",
        status: "ACTIVE",
        street_address: "12 Medical College Road",
        city: "Kozhikode",
        state: "Kerala",
        country: "India",
        postal_code: "673007",
        latitude: 11.250041,
        longitude: 75.82197
    },
    {
        name: "Green Valley Medical Centre",
        email: "info@greenvalley.example.com",
        phone: "9000000002",
        website: null,
        description: "Modern medical centre offering advanced diagnostics and specialized treatments.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Civil Station Road",
        city: "Kannur",
        state: "Kerala",
        country: "India",
        postal_code: "670002",
        latitude: 11.8745,
        longitude: 75.3704
    },
    {
        name: "Travancore Multispeciality Hospital",
        email: "contact@travancore.example.com",
        phone: "9000000003",
        website: null,
        description: "Multi-specialty healthcare facility with experienced doctors and modern medical equipment.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Kazhakkoottam",
        city: "Thiruvananthapuram",
        state: "Kerala",
        country: "India",
        postal_code: "695582",
        latitude: 8.568,
        longitude: 76.8731
    },
    {
        name: "Coastal Care Hospital",
        email: "info@coastalcare.example.com",
        phone: "9000000004",
        website: null,
        description: "Hospital providing general medicine, surgical care and emergency treatment.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Beach Road",
        city: "Kollam",
        state: "Kerala",
        country: "India",
        postal_code: "691001",
        latitude: 8.8932,
        longitude: 76.6141
    },
    {
        name: "Alappuzha Life Hospital",
        email: "contact@alappuzhalife.example.com",
        phone: "9000000005",
        website: null,
        description: "Patient-focused healthcare facility offering outpatient and inpatient services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Vazhicherry",
        city: "Alappuzha",
        state: "Kerala",
        country: "India",
        postal_code: "688001",
        latitude: 9.4981,
        longitude: 76.3388
    },
    {
        name: "Kottayam Advanced Medical Centre",
        email: "info@kottayamadvanced.example.com",
        phone: "9000000006",
        website: null,
        description: "Advanced medical centre providing specialist consultations and diagnostic services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "MC Road",
        city: "Kottayam",
        state: "Kerala",
        country: "India",
        postal_code: "686001",
        latitude: 9.5916,
        longitude: 76.5222
    },
    {
        name: "Idukki Hills Hospital",
        email: "contact@idukkihills.example.com",
        phone: "9000000007",
        website: null,
        description: "Community healthcare hospital serving patients across the Idukki region.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Thodupuzha Main Road",
        city: "Thodupuzha",
        state: "Kerala",
        country: "India",
        postal_code: "685584",
        latitude: 9.8947,
        longitude: 76.718
    },
    {
        name: "Cochin Prime Hospital",
        email: "info@cochinprime.example.com",
        phone: "9000000008",
        website: null,
        description: "Multi-specialty hospital with modern infrastructure and emergency care facilities.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Kaloor",
        city: "Kochi",
        state: "Kerala",
        country: "India",
        postal_code: "682017",
        latitude: 9.994,
        longitude: 76.291
    },
    {
        name: "Ernakulam City Medical Centre",
        email: "contact@ernakulamcity.example.com",
        phone: "9000000009",
        website: null,
        description: "Comprehensive healthcare centre providing specialist medical consultations.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Vyttila Junction",
        city: "Kochi",
        state: "Kerala",
        country: "India",
        postal_code: "682019",
        latitude: 9.9674,
        longitude: 76.3188
    },
    {
        name: "Thrissur Royal Hospital",
        email: "info@thrissurroyal.example.com",
        phone: "9000000010",
        website: null,
        description: "Healthcare institution offering surgical, medical and diagnostic services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Punkunnam",
        city: "Thrissur",
        state: "Kerala",
        country: "India",
        postal_code: "680002",
        latitude: 10.535,
        longitude: 76.214
    },
    {
        name: "Palakkad Care Hospital",
        email: "contact@palakkadcare.example.com",
        phone: "9000000011",
        website: null,
        description: "Patient-friendly hospital offering general and specialized healthcare services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Olavakkode",
        city: "Palakkad",
        state: "Kerala",
        country: "India",
        postal_code: "678002",
        latitude: 10.7867,
        longitude: 76.6548
    },
    {
        name: "Malappuram Medical Institute",
        email: "info@malappuraminstitute.example.com",
        phone: "9000000012",
        website: null,
        description: "Medical institute providing comprehensive healthcare and diagnostic facilities.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Down Hill",
        city: "Malappuram",
        state: "Kerala",
        country: "India",
        postal_code: "676519",
        latitude: 11.051,
        longitude: 76.0711
    },
    {
        name: "Perinthalmanna City Hospital",
        email: "contact@perinthalmannacity.example.com",
        phone: "9000000013",
        website: null,
        description: "Multi-specialty hospital providing quality medical services and patient care.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Calicut Road",
        city: "Perinthalmanna",
        state: "Kerala",
        country: "India",
        postal_code: "679322",
        latitude: 10.9777,
        longitude: 76.2274
    },
    {
        name: "Kasaragod Health Point",
        email: "contact@kasaragodhealth.example.com",
        phone: "9000000015",
        website: null,
        description: "Modern healthcare centre offering medical consultations and diagnostic services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Nayaks Road",
        city: "Kasaragod",
        state: "Kerala",
        country: "India",
        postal_code: "671121",
        latitude: 12.4996,
        longitude: 74.9869
    },
    {
        name: "Pathanamthitta Medicare Hospital",
        email: "info@pathanamthittamedicare.example.com",
        phone: "9000000016",
        website: null,
        description: "General and multi-specialty healthcare services for patients of all age groups.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Ring Road",
        city: "Pathanamthitta",
        state: "Kerala",
        country: "India",
        postal_code: "689645",
        latitude: 9.2648,
        longitude: 76.787
    },
    {
        name: "Chengannur Multispeciality Hospital",
        email: "contact@chengannurmulti.example.com",
        phone: "9000000017",
        website: null,
        description: "Multi-specialty healthcare facility with outpatient and inpatient services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "MC Road",
        city: "Chengannur",
        state: "Kerala",
        country: "India",
        postal_code: "689121",
        latitude: 9.315,
        longitude: 76.615
    },
    {
        name: "Attingal Family Hospital",
        email: "info@attingalfamily.example.com",
        phone: "9000000018",
        website: null,
        description: "Family healthcare centre providing preventive care and medical consultations.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "National Highway 66",
        city: "Attingal",
        state: "Kerala",
        country: "India",
        postal_code: "695101",
        latitude: 8.696,
        longitude: 76.815
    },
    {
        name: "Tirur Wellness Hospital",
        email: "contact@tirurwellness.example.com",
        phone: "9000000019",
        website: null,
        description: "Hospital focused on general medicine, wellness and specialized patient care.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Railway Station Road",
        city: "Tirur",
        state: "Kerala",
        country: "India",
        postal_code: "676101",
        latitude: 10.913,
        longitude: 75.921
    },
    {
        name: "Kunnamkulam Medical Centre",
        email: "info@kunnamkulammedical.example.com",
        phone: "9000000020",
        website: null,
        description: "Medical centre offering diagnostic, outpatient and emergency healthcare services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Guruvayur Road",
        city: "Kunnamkulam",
        state: "Kerala",
        country: "India",
        postal_code: "680503",
        latitude: 10.65,
        longitude: 76.08
    },
    {
        name: "Nila Multispeciality Hospital",
        email: "contact@nilahospital.example.com",
        phone: "9000000021",
        website: "https://www.nilahospital.example.com",
        description: "A modern multispeciality hospital offering comprehensive medical and surgical care.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Ottapalam Main Road",
        city: "Ottapalam",
        state: "Kerala",
        country: "India",
        postal_code: "679101",
        latitude: 10.773,
        longitude: 76.377
    },
    {
        name: "Bharath Medical Centre",
        email: "info@bharathmedical.example.com",
        phone: "9000000022",
        website: "https://www.bharathmedical.example.com",
        description: "A healthcare centre providing general medicine, diagnostics and specialist consultations.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Kanhangad Main Road",
        city: "Kanhangad",
        state: "Kerala",
        country: "India",
        postal_code: "671315",
        latitude: 12.308,
        longitude: 75.096
    },
    {
        name: "Pamba Valley Hospital",
        email: "contact@pambavalley.example.com",
        phone: "9000000023",
        website: "https://www.pambavalley.example.com",
        description: "A patient-focused hospital offering emergency, outpatient and inpatient medical services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Adoor Central Road",
        city: "Adoor",
        state: "Kerala",
        country: "India",
        postal_code: "691523",
        latitude: 9.155,
        longitude: 76.732
    },
    {
        name: "Chaliyar Health Hospital",
        email: "info@chaliyarhealth.example.com",
        phone: "9000000024",
        website: "https://www.chaliyarhealth.example.com",
        description: "A modern healthcare facility offering preventive care and specialized treatments.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Nilambur Main Road",
        city: "Nilambur",
        state: "Kerala",
        country: "India",
        postal_code: "679329",
        latitude: 11.279,
        longitude: 76.229
    },
    {
        name: "Periyar Advanced Hospital",
        email: "contact@periyaradvanced.example.com",
        phone: "9000000025",
        website: "https://www.periyaradvanced.example.com",
        description: "Advanced healthcare centre providing diagnostics, general medicine and surgical services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Aluva Market Road",
        city: "Aluva",
        state: "Kerala",
        country: "India",
        postal_code: "683101",
        latitude: 10.107,
        longitude: 76.352
    },
    {
        name: "Muvattupuzha City Hospital",
        email: "info@muvattupuzhacity.example.com",
        phone: "9000000026",
        website: "https://www.muvattupuzhacity.example.com",
        description: "A multispeciality hospital providing quality healthcare and emergency support.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "MC Road",
        city: "Muvattupuzha",
        state: "Kerala",
        country: "India",
        postal_code: "686661",
        latitude: 9.984,
        longitude: 76.577
    },
    {
        name: "Kuttanad Medical Centre",
        email: "contact@kuttanadmedical.example.com",
        phone: "9000000027",
        website: "https://www.kuttanadmedical.example.com",
        description: "A community medical centre offering general healthcare and diagnostic services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Thakazhi Road",
        city: "Thakazhi",
        state: "Kerala",
        country: "India",
        postal_code: "688562",
        latitude: 9.39,
        longitude: 76.39
    },
    {
        name: "Mananthavady Health Institute",
        email: "info@mananthavadyhealth.example.com",
        phone: "9000000028",
        website: "https://www.mananthavadyhealth.example.com",
        description: "A healthcare institute offering specialist consultations and patient care services.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Payyampally Road",
        city: "Mananthavady",
        state: "Kerala",
        country: "India",
        postal_code: "670645",
        latitude: 11.8,
        longitude: 76.001
    },
    {
        name: "Chavakkad Royal Medical Centre",
        email: "contact@chavakkadroyal.example.com",
        phone: "9000000029",
        website: "https://www.chavakkadroyal.example.com",
        description: "A modern medical centre providing outpatient, inpatient and diagnostic facilities.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Guruvayur Road",
        city: "Chavakkad",
        state: "Kerala",
        country: "India",
        postal_code: "680506",
        latitude: 10.533,
        longitude: 76.05
    },
    {
        name: "Kozhencherry Life Hospital",
        email: "info@kozhencherrylife.example.com",
        phone: "9000000030",
        website: "https://www.kozhencherrylife.example.com",
        description: "A multispeciality healthcare facility focused on comprehensive patient care.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Main Central Road",
        city: "Kozhencherry",
        state: "Kerala",
        country: "India",
        postal_code: "689641",
        latitude: 9.328,
        longitude: 76.7
    },
    {
        name: "Wayanad Green Medical Centre",
        email: "info@wayanadgreen.example.com",
        phone: "9000000014",
        website: "https://www.wayanadgreenfresh.com",
        description: "Healthcare facility serving the Wayanad region with general and specialist care.",
        image_url: null,
        image_public_id: null,
        status: "ACTIVE",
        street_address: "Main Road",
        city: "Kalpetta",
        state: "Kerala",
        country: "India",
        postal_code: "673121",
        latitude: 11.6085,
        longitude: 76.0822
    }
];

type Hospital = {
    name: string;
    email: string;
    phone: string;
    website: string | null;
    description: string | null;
    image_url: string | null;
    image_public_id: string | null;
    status: string;
    street_address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string | null;
    latitude: number | null;
    longitude: number | null;
};
async function mockHospitals() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL_SCRIPT,
    });

    try {
        await client.connect();
        console.log("database connected successfully");

        const columns: (keyof Hospital)[] = [
            "name", "email", "phone", "website", "description",
            "image_url", "image_public_id", "status", "street_address",
            "city", "state", "country", "postal_code", "latitude", "longitude",
        ];

        const values: unknown[] = [];

        const placeholders = hospitalData.map((hospital) => {
            const offset = values.length;

            values.push(...columns.map((column) => hospital[column]));

            return `(${columns.map((_, i) => `$${offset + i + 1}`).join(", ")})`;
        });

        const query = `
            INSERT INTO hospitals (${columns.join(", ")})
            VALUES ${placeholders.join(", ")}
            RETURNING *;
        `;

        const result = await client.query(query, values);
        console.log("hospitals added successfully");
    } catch (error) {
        console.log("error", error);
    }
}

mockHospitals();