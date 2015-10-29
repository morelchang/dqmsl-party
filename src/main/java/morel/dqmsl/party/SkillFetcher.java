package morel.dqmsl.party;

import java.io.IOException;
import java.util.Map;

import morel.dqmsl.party.parser.SkillParser;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class SkillFetcher {
	
	public Map<String, String> fetch() throws IOException {
		Document doc = Jsoup
				.connect("http://dqmsl-search.net/measure/search")
				.userAgent(
						"Mozilla/5.0 (Windows; U; WindowsNT 5.1; en-US; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")
				.referrer("http://www.google.com").get();

		if (doc.select("span.skillButton").size() <= 0) {
			// 404 not found
			return null;
		}
		
		return new SkillParser().parse(doc);
	}
	
}
