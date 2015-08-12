package morel.dqmsl.party;

import java.io.IOException;
import java.text.ParseException;

import morel.dqmsl.party.model.Monster;
import morel.dqmsl.party.parser.MonsterParser;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class PartyFetcher {

	public static void main(String[] args) {
		// fetch and print result
		PartyFetcher pf = new PartyFetcher();

		int upTo = 3;
		for (int no = 1; no <= upTo; no++) {
			// fetch monster
			Monster mm = null;
			try {
				mm = pf.fetch(no);
			} catch (Exception e) {
				System.out.println("fetch no:" + no + " failed:" + e.getMessage());
				e.printStackTrace();
				continue;
			}
			
			if (mm == null) {
				System.out.println("no:" + no + " not found");
				continue;
			}
			
			System.out.println(mm.toString());
		}
	}

	public Monster fetch(int no) throws IOException, ParseException, InterruptedException {
		Document doc = Jsoup.connect("http://dqmsl-search.net/monster/detail?no=" + no)
				.userAgent("Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")
				.referrer("http://www.google.com").get();
		
		if (doc.select("div.mboxh h3").text().contains("404")) {
			// 404 not found
			return null;
		}
		
		Monster m = new MonsterParser().parse(doc);
		if (m.getHp() == 0) {
			System.out.println("monster data incorrect, no:" + no);
			System.in.read();
		}
		return m;
	}

}
